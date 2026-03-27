# ResiboCash Project Budget

**Total Budget: $500**

## Budget Allocation

| Category | Allocation | Controls |
|----------|-----------|----------|
| **Azure Infrastructure** | $150 | Azure Budget alerts at 50%/80%/100% |
| **Claude Agents** | $350 | 3x/week schedule (Mon/Wed/Fri) |

## Azure Cost Breakdown (Monthly Estimate)

| Resource | SKU | Est. Cost |
|----------|-----|-----------|
| App Service Plan | F1 Free | $0 |
| App Service | Linux Node.js | $0 |
| Storage Account | Standard LRS | ~$0.02/GB |
| Cosmos DB | Free Tier (Serverless) | $0 |
| **Monthly Total** | | **~$0-2** |

Azure budget alerts configured in `infra/main.bicep`:
- **$75 (50%)** - Email notification
- **$120 (80%)** - Email notification
- **$150 (100%)** - Email notification + Owner role alert

## Claude Agent Cost Breakdown (Monthly Estimate)

| Agent | Schedule | Est. Cost/Run | Monthly (12 runs) |
|-------|----------|---------------|-------------------|
| PM Agent | Mon/Wed/Fri 10pm ET | ~$1.50-3.00 | ~$18-36 |
| Builder Agent | Mon/Wed/Fri 11pm ET | ~$2.00-4.00 | ~$24-48 |
| Tester Agent | Mon/Wed/Fri 1am ET | ~$1.50-3.00 | ~$18-36 |
| **Monthly Total** | | | **~$60-120** |

At ~$90/month average, the $350 Claude budget lasts **~3.5-4 months**.

## Budget Guardrails

1. **Azure**: Budget resource with email alerts at 50/80/100% thresholds
2. **Claude**: Agents run 3x/week instead of daily (saves ~57% vs daily)
3. **Model**: Using `claude-sonnet-4-6` (not opus) for cost efficiency
4. **Review**: Check spend monthly at:
   - Azure: Portal > Cost Management > Budgets
   - Claude: https://claude.ai/code/scheduled

## When to Adjust

- If Azure spend hits $120 → review resource usage, consider downgrading
- If Claude agents are not producing value → reduce to 2x/week or disable
- If budget is underspent → consider upgrading to daily runs or adding agents
