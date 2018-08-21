DOCKER  := docker
GRADLE  := ./gradlew
NPM     := npm
NAIS    := nais
GIT     := git
VERSION := $(shell git describe --abbrev=0)
REGISTRY:= repo.adeo.no:5443

.PHONY: all build test docker docker-push release manifest

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
	$(DOCKER) build --pull -t $(REGISTRY)/eessi-fagmodul-frontend .

docker-push:
	$(DOCKER) tag $(REGISTRY)/eessi-fagmodul-frontend $(REGISTRY)/eessi-fagmodul-frontend:$(VERSION)
	$(DOCKER) push $(REGISTRY)/eessi-fagmodul-frontend:$(VERSION)

tag:
	$(eval VERSION=$(shell echo $$(($(VERSION) + 1))))
	$(GIT) tag -a $(VERSION) -m "auto-tag from Makefile"

manifest:
	$(NAIS) upload --app eessi-fagmodul-frontend -v $(VERSION)
