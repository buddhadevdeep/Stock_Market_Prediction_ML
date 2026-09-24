import os
import sys

# Safe UTF-8 reconfiguration for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Ensure ml_service directory is in python search path
current_dir = os.path.dirname(os.path.abspath(__file__))
ml_service_dir = os.path.join(current_dir, "ml_service")
if ml_service_dir not in sys.path:
    sys.path.insert(0, ml_service_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from ml_service.app import app

if __name__ == '__main__':
    port = int(os.environ.get("ML_PORT", 8000))
    print(f"[OK] Starting Stock Prediction Python ML Service on http://127.0.0.1:{port} ...")
    app.run(host="0.0.0.0", port=port, debug=False)
