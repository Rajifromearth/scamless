from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime, timezone
from urllib.parse import urlparse
import socket
import ssl
import requests
import re

try:
    import whois  # python-whois
except ImportError:
    whois = None

router = APIRouter(prefix="/api/link-check", tags=["link-check"])

SUSPICIOUS_TLDS = {"xyz", "top", "click", "gq", "tk", "ml", "cf", "work", "loan"}
IP_URL_PATTERN = re.compile(r"^https?://\d{1,3}(\.\d{1,3}){3}")


class LinkCheckRequest(BaseModel):
    url: str


class LinkCheckResponse(BaseModel):
    verdict: str
    risk_score: int
    flags: list[str]
    details: dict


def get_domain_age_days(hostname: str):
    if whois is None:
        return None
    try:
        w = whois.whois(hostname)
        created = w.creation_date
        if isinstance(created, list):
            created = created[0]
        if created is None:
            return None
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        age_days = (datetime.now(timezone.utc) - created).days
        return age_days
    except Exception:
        return None


def check_ssl(hostname: str):
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=5) as sock:
            with ctx.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                return {"valid": True, "issuer": dict(x[0] for x in cert.get("issuer", []))}
    except Exception as e:
        return {"valid": False, "error": str(e)}


def trace_redirects(url: str):
    try:
        resp = requests.get(url, timeout=6, allow_redirects=True)
        chain = [r.url for r in resp.history] + [resp.url]
        return chain
    except Exception:
        return [url]


@router.post("", response_model=LinkCheckResponse)
def check_link(payload: LinkCheckRequest):
    url = payload.url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    flags = []
    risk_score = 0
    details = {}

    if IP_URL_PATTERN.match(url):
        flags.append("URL uses a raw IP address instead of a domain name")
        risk_score += 25

    tld = hostname.split(".")[-1] if "." in hostname else ""
    if tld in SUSPICIOUS_TLDS:
        flags.append(f"Uses a TLD ('.{tld}') commonly associated with scam sites")
        risk_score += 15

    age_days = get_domain_age_days(hostname)
    details["domain_age_days"] = age_days
    if age_days is not None and age_days < 30:
        flags.append(f"Domain was registered only {age_days} days ago")
        risk_score += 30

    ssl_info = check_ssl(hostname)
    details["ssl"] = ssl_info
    if not ssl_info.get("valid"):
        flags.append("Site does not have a valid SSL certificate")
        risk_score += 20

    chain = trace_redirects(url)
    details["redirect_chain"] = chain
    if len(chain) > 2:
        flags.append(f"URL redirects {len(chain) - 1} times before reaching final destination")
        risk_score += 15

    risk_score = min(risk_score, 100)
    verdict = "High risk" if risk_score >= 60 else "Medium risk" if risk_score >= 30 else "Low risk"

    return LinkCheckResponse(verdict=verdict, risk_score=risk_score, flags=flags, details=details) 