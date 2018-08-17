DOCKER  := docker
GRADLE  := ./gradlew
NPM     := npm
NAIS    := nais
VERSION := $(shell cat ./VERSION)
REGISTRY:= repo.adeo.no:5443

.PHONY: all build test docker docker-push bump-version release manifest

all: build test docker
release: tag docker-push

build:
	cd src/main/js && $(NPM) install
	cd src/main/js && $(NPM) run build
	$(GRADLE) assemble

test:
	$(GRADLE) test

docker:
	$(NAIS) validate
	$(DOCKER) build --pull -t $(REGISTRY)/eessi-fagmodul-frontend -t $(REGISTRY)/eessi-fagmodul-frontend:$(VERSION) .

docker-push:
	$(DOCKER) push $(REGISTRY)/eessi-fagmodul-frontend:$(VERSION)

bump-version:
	@echo $$(($$(cat ./VERSION) + 1)) > ./VERSION

tag:
	git add VERSION
	git commit -m "Bump version to $(VERSION) [skip ci]"
	git tag -a $(VERSION) -m "auto-tag from Makefile"

manifest:
	nais upload --app eessi-fagmodul-frontend -v $(VERSION)
