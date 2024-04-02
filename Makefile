.PHONY: install test run clean help

# Install dependencies
install:
    npm install

# Run tests
test:
    npm test

# Start the application
run:
    npm run app:start

# Clean node modules
clean:
    rm -rf node_modules

# Display help information
help:
    @echo "Makefile commands:"
    @echo "install - Install dependencies"
    @echo "test - Run tests"
    @echo "run - Start the application"
    @echo "clean - Remove installed node_modules"
    @echo "help - Display this help information"
