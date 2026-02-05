import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Role(str, enum.Enum):
    user = "user"
    admin = "admin"
    superadmin = "superadmin"


class EventType(str, enum.Enum):
    FESTIVAL = "FESTIVAL"
    TRIP = "TRIP"
    MARKET = "MARKET"


class EventState(str, enum.Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    CLOSED = "CLOSED"
    DONE = "DONE"


class OrderStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"


class Kanoon(Base, TimestampMixin):
    __tablename__ = "kanoons"
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(128), unique=True)
    logo_url: Mapped[str | None] = mapped_column(String(256), nullable=True)
    contact_info: Mapped[dict] = mapped_column(JSON, default=dict)
    social_links: Mapped[dict] = mapped_column(JSON, default=dict)
    about_text: Mapped[str] = mapped_column(Text, default="")
    rules_text: Mapped[str] = mapped_column(Text, default="")


class User(Base, TimestampMixin):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    kanoon_id: Mapped[int] = mapped_column(ForeignKey("kanoons.id", ondelete="CASCADE"), index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    full_name: Mapped[str] = mapped_column(String(120))
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[Role] = mapped_column(Enum(Role), default=Role.user)
    willing_to_help: Mapped[bool] = mapped_column(Boolean, default=False)
    help_domains: Mapped[list] = mapped_column(JSON, default=list)
    experience_text: Mapped[str] = mapped_column(Text, default="")
    extra_notes: Mapped[str] = mapped_column(Text, default="")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class CouncilMember(Base, TimestampMixin):
    __tablename__ = "council_members"
    id: Mapped[int] = mapped_column(primary_key=True)
    kanoon_id: Mapped[int] = mapped_column(ForeignKey("kanoons.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120))
    role_title: Mapped[str] = mapped_column(String(120))
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    period: Mapped[str] = mapped_column(String(64))
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)


class Event(Base, TimestampMixin):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(primary_key=True)
    kanoon_id: Mapped[int] = mapped_column(ForeignKey("kanoons.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    event_type: Mapped[EventType] = mapped_column(Enum(EventType), index=True)
    state: Mapped[EventState] = mapped_column(Enum(EventState), default=EventState.DRAFT, index=True)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    base_price: Mapped[float] = mapped_column(Float, default=0)
    subsidy_cap: Mapped[float] = mapped_column(Float, default=0)


class Hall(Base, TimestampMixin):
    __tablename__ = "halls"
    id: Mapped[int] = mapped_column(primary_key=True)
    kanoon_id: Mapped[int] = mapped_column(ForeignKey("kanoons.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120))


class Seat(Base, TimestampMixin):
    __tablename__ = "seats"
    id: Mapped[int] = mapped_column(primary_key=True)
    kanoon_id: Mapped[int] = mapped_column(ForeignKey("kanoons.id", ondelete="CASCADE"), index=True)
    hall_id: Mapped[int] = mapped_column(ForeignKey("halls.id", ondelete="CASCADE"), index=True)
    row_label: Mapped[str] = mapped_column(String(16))
    col_number: Mapped[int] = mapped_column(Integer)
    seat_label: Mapped[str] = mapped_column(String(32))
    price: Mapped[float] = mapped_column(Float)
    gender_restriction: Mapped[str] = mapped_column(String(16), default="any")
    admin_blocked: Mapped[bool] = mapped_column(Boolean, default=False)
    __table_args__ = (UniqueConstraint("hall_id", "seat_label", name="uq_hall_seat"),)


class Order(Base, TimestampMixin):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    kanoon_id: Mapped[int] = mapped_column(ForeignKey("kanoons.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id", ondelete="CASCADE"), index=True)
    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus), default=OrderStatus.pending)
    total_price: Mapped[float] = mapped_column(Float, default=0)
    subsidy_applied: Mapped[float] = mapped_column(Float, default=0)
    meta: Mapped[dict] = mapped_column(JSON, default=dict)


class SeatReservation(Base, TimestampMixin):
    __tablename__ = "seat_reservations"
    id: Mapped[int] = mapped_column(primary_key=True)
    kanoon_id: Mapped[int] = mapped_column(ForeignKey("kanoons.id", ondelete="CASCADE"), index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), index=True)
    seat_id: Mapped[int] = mapped_column(ForeignKey("seats.id", ondelete="CASCADE"), index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class MarketBoothRequest(Base, TimestampMixin):
    __tablename__ = "market_booth_requests"
    id: Mapped[int] = mapped_column(primary_key=True)
    kanoon_id: Mapped[int] = mapped_column(ForeignKey("kanoons.id", ondelete="CASCADE"), index=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    quantity: Mapped[int] = mapped_column(Integer)
    day_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    main_seller: Mapped[dict] = mapped_column(JSON)
    extra_sellers: Mapped[list] = mapped_column(JSON, default=list)
    terms_accepted: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(32), default="pending")


class GalleryItem(Base, TimestampMixin):
    __tablename__ = "gallery_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    kanoon_id: Mapped[int] = mapped_column(ForeignKey("kanoons.id", ondelete="CASCADE"), index=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id", ondelete="CASCADE"), index=True)
    file_url: Mapped[str] = mapped_column(String(512))
    title: Mapped[str] = mapped_column(String(255), default="")


class Review(Base, TimestampMixin):
    __tablename__ = "reviews"
    id: Mapped[int] = mapped_column(primary_key=True)
    kanoon_id: Mapped[int] = mapped_column(ForeignKey("kanoons.id", ondelete="CASCADE"), index=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str] = mapped_column(Text)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(primary_key=True)
    kanoon_id: Mapped[int] = mapped_column(index=True)
    actor_user_id: Mapped[int | None] = mapped_column(nullable=True)
    action: Mapped[str] = mapped_column(String(100), index=True)
    detail: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
