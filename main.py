"""Small, dependency-free development server for the portfolio."""

from __future__ import annotations

import argparse
import mimetypes
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent

mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("application/xml", ".xml")


class PortfolioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def log_message(self, format: str, *args: object) -> None:
        print(f"[portfolio] {self.address_string()} - {format % args}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve the portfolio locally")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=8000, type=int)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), PortfolioHandler)
    print(f"Portfolio available at http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping portfolio server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
