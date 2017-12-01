
# Todo: Install circleci if needed, see mongo-exporter

help:							## Show this help.
	@echo ''
	@echo 'Available commands:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo ''
.PHONY: help

gen-readme:				## Update README.md.
	npm run docs
.PHONY: gen-readme

cover:
	istanbul cover _mocha -- test --recursive --timeout=20000
.PHONY: cover

circleci:					## Run circleci build locally.
	circleci build
.PHONY: circleci

