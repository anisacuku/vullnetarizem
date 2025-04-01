from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any

from backend.models import OpportunityCreate, Opportunity, OpportunityOut
from backend.database import (
    get_all_opportunities,
    get_opportunity_by_id,
    create_opportunity,
    get_organization_by_id
)
from backend.routers.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[OpportunityOut])
async def list_opportunities(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    List all available opportunities.
    Both volunteers and organizations can access this endpoint.
    """
    opportunities = get_all_opportunities()

    # Enrich opportunities with organization name
    result = []
    for opp in opportunities:
        organization = get_organization_by_id(opp.get("organization_id"))
        org_name = organization.get("name", "Unknown Organization") if organization else "Unknown Organization"

        # Create a copy of the opportunity with organization name
        enriched_opp = opp.copy()
        enriched_opp["organization_name"] = org_name
        result.append(enriched_opp)

    return result


@router.get("/{opportunity_id}", response_model=OpportunityOut)
async def get_opportunity(
        opportunity_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get details of a specific opportunity.
    Both volunteers and organizations can access this endpoint.
    """
    opportunity = get_opportunity_by_id(opportunity_id)

    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found"
        )

    # Add organization name
    organization = get_organization_by_id(opportunity.get("organization_id"))
    org_name = organization.get("name", "Unknown Organization") if organization else "Unknown Organization"
    opportunity["organization_name"] = org_name

    return opportunity


@router.post("/", response_model=Opportunity, status_code=status.HTTP_201_CREATED)
async def create_new_opportunity(
        opportunity: OpportunityCreate,
        current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Create a new volunteer opportunity.
    Only organization users can create opportunities.
    """
    # Verify the user is an organization
    if current_user.get("user_type") != "organization":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organizations can create opportunities"
        )

    # Verify the organization ID matches the current user
    if opportunity.organization_id != current_user.get("id"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create opportunities for your own organization"
        )

    # Create the opportunity
    new_opportunity = create_opportunity(opportunity.dict())

    if not new_opportunity:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create opportunity"
        )

    return new_opportunity