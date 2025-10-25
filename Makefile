# Supabase Functions Configuration

# Deploy commands
deploy:
	supabase functions deploy create-subscription
	supabase functions deploy cancel-subscription
	supabase functions deploy subscription-status
	supabase functions deploy create-booking-payment
	supabase functions deploy onboard-provider
	supabase functions deploy webhook

# Set secrets
secrets:
	supabase secrets set STRIPE_SECRET_KEY=$(STRIPE_SECRET_KEY)
	supabase secrets set STRIPE_WEBHOOK_SECRET=$(STRIPE_WEBHOOK_SECRET)
	supabase secrets set SUPABASE_URL=$(SUPABASE_URL)
	supabase secrets set SUPABASE_SERVICE_ROLE_KEY=$(SUPABASE_SERVICE_ROLE_KEY)
	supabase secrets set APP_URL=$(APP_URL)

# Test functions locally
test-local:
	supabase functions serve

# View logs
logs:
	supabase functions logs webhook
	supabase functions logs create-subscription
	supabase functions logs create-booking-payment

# Help
help:
	@echo "Available commands:"
	@echo "  make deploy        - Deploy all functions"
	@echo "  make secrets       - Set environment secrets"
	@echo "  make test-local    - Test functions locally"
	@echo "  make logs          - View function logs"
