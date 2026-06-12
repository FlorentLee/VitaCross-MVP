from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.schemas import LedgerEntryResponse, LedgerEntryUpdate
from app.models.domain import LedgerItem

router = APIRouter()

@router.get("", response_model=List[LedgerEntryResponse])
def get_ledger_entries(db: Session = Depends(get_db)):
    """
    获取账簿所有明细记录
    """
    items = db.query(LedgerItem).order_by(LedgerItem.id.desc()).all()
    return items

@router.put("/{item_id}", response_model=LedgerEntryResponse)
def update_ledger_entry(item_id: int, update_data: LedgerEntryUpdate, db: Session = Depends(get_db)):
    """
    更新账簿记录
    """
    item = db.query(LedgerItem).filter(LedgerItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(item, key, value)
        
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_ledger_entry(item_id: int, db: Session = Depends(get_db)):
    """
    删除账簿记录
    """
    item = db.query(LedgerItem).filter(LedgerItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Deleted successfully", "id": item_id}
