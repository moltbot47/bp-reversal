# ADR-002: Phase-Based Item Unlock System

## Status
Accepted

## Context
The 90-day protocol has 21 daily items. Showing all 21 on Day 1 would overwhelm new users and reduce adherence. Research shows habit stacking works best with gradual introduction.

## Decision
Three-phase progressive unlock:
- **Phase 1 (Days 1-30)**: 12 foundation items — core supplements, hydration, breathing, BP checks
- **Phase 2 (Days 31-60)**: +6 amplification items — L-citrulline, ashwagandha, sunlight, beetroot, magnesium, cold exposure
- **Phase 3 (Days 61-90)**: +3 optimization items — walking, evening breathing, sleep schedule

Locked items are visible but grayed out with a lock icon, showing users what's coming without overwhelming them.

## Alternatives Considered
- **All items from Day 1**: Simpler code but higher dropout risk
- **Fully hidden until unlock**: Cleaner UI but no anticipation or understanding of the full protocol
- **User-chosen unlock**: Flexibility but contradicts the structured protocol design

## Consequences
- **Positive**: Reduces cognitive load, creates milestone moments, matches research protocol
- **Negative**: Phase 2/3 items can't be tracked early if user wants to start them
