
# Todo: Install circleci if needed, see mongo-exporter

help:							## Show this help.
	@echo ''
	@echo 'Available commands:'
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo ''
.PHONY: help

up: 							## Bring up the environment.
	docker-compose up
.PHONY: up

up-deps:					## Bring up all the dependencies
	docker-compose up
.PHONY: up-deps

down:							## Bring the environment down.
	docker-compose down
.PHONY: down

gen-readme:				## Update README.md.
	npm run readme
.PHONY: gen-readme

gen-docs:					## Update all docs (README.md, api-docs, etc.)
	npm run docs
.PHONY: gen-docs

# Todo: Fix docker based solution here ...
gen-api-docs:			## Generate the api-docs
	node_modules/.bin/jsdoc2md --configure $(PWD)/jsdoc.json $(PWD)/src/*.js > $(PWD)/docs/api-docs.md
.PHONY: gen-api-docs

# Todo: delete
coverage:					## Code coverage
	istanbul cover _mocha -- test --recursive --timeout=20000
.PHONY: coverage

circleci:					## Run circleci build locally.
	circleci build
.PHONY: circleci

circleci-validate:## Validate the circleci config-file.
	circleci config validate
.PHONY: circleci validate

test:
	npm run test
.PHONY: test

# Todo: This can be removed
# Usage: make watch WATCHMAKE=foo
# Borrowed from: https://stackoverflow.com/questions/7539563/is-there-a-smarter-alternative-to-watch-make/27643754#27643754
watch:
	while true; do \
		make $(WATCHMAKE); \
		inotifywait -qre close_write .; \
	done
.PHONY: watch

