# Analytics & Funnel Tracking Guide

This guide explains how to view and analyze funnel metrics in Railway.

## Funnel Steps Tracked

1. **Page View** (`funnel_step: 1`)
   - Event: `page_view`
   - Tracked when: User lands on the homepage

2. **Step 1 Success** (`funnel_step: 2`)
   - Event: `step_1_success`
   - Tracked when: User uploads file and fills in details, clicks "Next"

3. **Step 2 Start** (`funnel_step: 3`)
   - Event: `step_2_start`
   - Tracked when: User reaches pricing/plan selection page

4. **Payment Initiated** (`funnel_step: 4`)
   - Event: `payment_initiated`
   - Tracked when: User clicks "Continue to Payment"

5. **Payment Success** (`funnel_step: 5`)
   - Event: `payment_success`
   - Tracked when: Payment is verified as successful

6. **File Received** (`funnel_step: 6`)
   - Event: `file_received`
   - Tracked when: User successfully receives/downloads the file

## Viewing Metrics in Railway

### Method 1: Railway Dashboard - Log Explorer (Recommended)

1. **Access Log Explorer**
   - Go to https://railway.app
   - Select your project
   - Click **Observability** tab
   - Click **Log Explorer**

2. **Query Funnel Events**

   **View all funnel events:**
   ```
   @attribute.type:funnel_event
   ```

   **View specific funnel step:**
   ```
   @attribute.funnel_step:1
   @attribute.funnel_step:2
   @attribute.funnel_step:3
   @attribute.funnel_step:4
   @attribute.funnel_step:5
   @attribute.funnel_step:6
   ```

   **View specific events:**
   ```
   @attribute.event:page_view
   @attribute.event:step_1_success
   @attribute.event:payment_initiated
   @attribute.event:payment_success
   @attribute.event:file_received
   ```

   **View conversion funnel:**
   ```
   @attribute.type:funnel_event
   ```
   Then group by `funnel_step` to see counts per step

3. **Create Custom Widgets**

   In **Observability Dashboard** → **Create Widget**:

   - **Widget Type**: Count
   - **Query**: `@attribute.event:payment_success`
   - **Name**: "Payment Successes"

   Create widgets for each funnel step to visualize conversion rates.

### Method 2: Railway CLI

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **View Logs**
   ```bash
   # View all logs
   railway logs

   # Filter by service
   railway logs --service backend

   # Filter funnel events
   railway logs | grep "funnel_event"

   # View specific step
   railway logs | grep "funnel_step:4"
   ```

### Method 3: Export and Analyze

1. **Export Logs**
   - In Railway Dashboard → Log Explorer
   - Use filters to get specific events
   - Export as CSV/JSON

2. **Analyze in Spreadsheet**
   - Import exported data
   - Group by `funnel_step` to calculate conversion rates
   - Create funnel visualization

## Calculating Conversion Rates

### Example Queries

**Step 1 → Step 2 Conversion:**
- Count `funnel_step:1` (page views)
- Count `funnel_step:2` (step 1 success)
- Conversion = (step 2 / step 1) × 100

**Step 2 → Step 3 Conversion:**
- Count `funnel_step:2` (step 1 success)
- Count `funnel_step:3` (step 2 start)
- Conversion = (step 3 / step 2) × 100

**Overall Conversion Rate:**
- Count `funnel_step:1` (page views)
- Count `funnel_step:6` (file received)
- Conversion = (step 6 / step 1) × 100

## Example Dashboard Queries

### Count Events by Step
```
@attribute.type:funnel_event
```
Group by: `funnel_step`

### Payment Funnel
```
@attribute.event:payment_initiated OR @attribute.event:payment_success
```

### Error Tracking
```
@attribute.event:error
```

### User Journey Tracking
```
@attribute.session_id:session_1234567890
```

## Log Format

Events are logged as structured JSON:

```json
{
  "type": "funnel_event",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "event": "payment_success",
  "funnel_step": 5,
  "step": "payment_complete",
  "session_id": "session_1234567890_abc123",
  "selectedPlan": "complete",
  "amount": 20.00,
  "userAgent": "...",
  "url": "https://yoursite.com/payment-success"
}
```

## Troubleshooting

### Events Not Appearing

1. **Check Backend Logs**
   - Verify `/api/analytics` endpoint is receiving requests
   - Check Railway logs for errors

2. **Verify Frontend**
   - Check browser console for analytics errors
   - Verify `VITE_API_URL` is set correctly

3. **Check Railway Logs**
   - Look for `funnel_event` type logs
   - Verify JSON is being parsed correctly

### Query Not Working

1. **Use Exact Attribute Names**
   - Railway uses `@attribute.` prefix for custom attributes
   - Use exact field names from log structure

2. **Check Time Range**
   - Ensure you're looking at the correct time period
   - Events appear in real-time

## Best Practices

1. **Monitor Daily**
   - Check conversion rates daily
   - Identify drop-off points

2. **Set Up Alerts**
   - Alert on error spikes
   - Alert on conversion rate drops

3. **Track Trends**
   - Compare week-over-week
   - Identify patterns

4. **Optimize Funnel**
   - Focus on steps with highest drop-off
   - A/B test improvements

## Next Steps

1. Set up Railway Observability Dashboard widgets
2. Create alerts for critical funnel steps
3. Export data regularly for deeper analysis
4. Monitor conversion rates and optimize
