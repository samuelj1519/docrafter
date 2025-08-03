start:
	@nohup serve -s dist > out.log 2>&1 & echo $$! > serve.pid

stop:
	@if [ -f serve.pid ]; then \
		PID=$$(cat serve.pid); \
		pkill -P $$PID 2>/dev/null || true; \
		kill $$PID 2>/dev/null || true; \
		rm -f serve.pid; \
	else \
		echo "No PID file found. Checking for serve processes..."; \
		pkill -f "serve -s dist" 2>/dev/null || true; \
		pkill -f "node.*serve.*-s.*dist" 2>/dev/null || true; \
	fi

restart: stop start

