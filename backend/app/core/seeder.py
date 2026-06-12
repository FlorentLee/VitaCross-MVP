from sqlalchemy.orm import Session
from app.models.domain import LedgerItem
from datetime import datetime

def seed_initial_data(db: Session):
    """Seed the database with realistic VitaCross medical demo records."""
    if db.query(LedgerItem).count() == 0:
        print("[VitaCross] Database is empty. Seeding medical demo data...")
        initial_items = [
            LedgerItem(
                invoice_number='MR-2026-00147',
                total_amount=68500.00,
                invoice_type='住院结算单 · 北京和睦家医院',
                created_at=datetime(2026, 6, 10),
                compliance_score=97.5,
                risk_warning=None,
                patient_name='* Wilson',
                hospital_name='北京和睦家医院 (Beijing United Family Hospital)',
                diagnosis='急性阑尾炎',
                diagnosis_en='Acute appendicitis',
                icd_code='K35.80',
                currency='USD',
                settlement_status='AUTO_SETTLED',
            ),
            LedgerItem(
                invoice_number='MR-2026-00148',
                total_amount=12800.00,
                invoice_type='门诊体检报告 · 上海华山医院',
                created_at=datetime(2026, 6, 9),
                compliance_score=99.2,
                risk_warning=None,
                patient_name='* Tanaka',
                hospital_name='上海华山医院 (Huashan Hospital)',
                diagnosis='2型糖尿病',
                diagnosis_en='Type 2 diabetes mellitus',
                icd_code='E11.9',
                currency='JPY',
                settlement_status='PENDING_INSURER_APPROVAL',
            ),
            LedgerItem(
                invoice_number='MR-2026-00149',
                total_amount=185000.00,
                invoice_type='手术结算单 · 广州南方医科大学南方医院',
                created_at=datetime(2026, 6, 8),
                compliance_score=94.0,
                risk_warning='AI预警：手术费用高于区域均值 18%，建议保司复核',
                patient_name='* Johnson',
                hospital_name='南方医科大学南方医院 (Nanfang Hospital)',
                diagnosis='腰椎间盘突出症',
                diagnosis_en='Lumbar disc herniation',
                icd_code='M51.16',
                currency='USD',
                settlement_status='PENDING_INSURER_APPROVAL',
            ),
            LedgerItem(
                invoice_number='MR-2026-00150',
                total_amount=4200.00,
                invoice_type='门诊处方单 · 北京协和医院',
                created_at=datetime(2026, 6, 7),
                compliance_score=100.0,
                risk_warning=None,
                patient_name='* Chen',
                hospital_name='北京协和医院 (Peking Union Medical College Hospital)',
                diagnosis='过敏性鼻炎',
                diagnosis_en='Allergic rhinitis',
                icd_code='J30.1',
                currency='CNY',
                settlement_status='SETTLED',
            ),
            LedgerItem(
                invoice_number='MR-2026-00151',
                total_amount=92400.00,
                invoice_type='住院结算单 · 上海瑞金医院',
                created_at=datetime(2026, 6, 6),
                compliance_score=62.0,
                risk_warning='风险拦截：ICD编码与诊断描述不匹配，差异需人工核验',
                patient_name='* Rodriguez',
                hospital_name='上海瑞金医院 (Ruijin Hospital)',
                diagnosis='冠状动脉粥样硬化性心脏病',
                diagnosis_en='Coronary atherosclerotic heart disease',
                icd_code='I25.10',
                currency='USD',
                settlement_status='REJECTED',
            ),
        ]
        db.add_all(initial_items)
        db.commit()
        print("[VitaCross] Medical demo data seeded successfully.")
    else:
        print("[VitaCross] Database already contains data. Skipping seeding.")
