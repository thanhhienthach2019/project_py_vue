from app.models.auth.log import LoginLog
from sqlalchemy.orm import Session
from datetime import datetime

def log_login_event(
    db: Session,
    username: str,
    ip_address: str = None,
    user_agent: str = None
):
    login_log = LoginLog(
        Username=username,
        Timestamp=datetime.utcnow(),
        EventType="user.login",
        IPAddress=ip_address,
        UserAgent=user_agent
    )
    db.add(login_log)
    db.commit()
