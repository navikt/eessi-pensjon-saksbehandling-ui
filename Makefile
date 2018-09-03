DOCKER  := docker
NPM     := npm
NAIS    := nais
GIT     := git
VERSION := $(shell git describe --abbrev=0)
REGISTRY:= repo.adeo.no:5443

.PHONY: all build docker docker-push release manifest

all: build docker
release: tag docker-push

build:
	$(NPM) install
	$(NPM) run build

docker:
	$(NAIS) validate
	$(DOCKER) build --pull -t $(REGISTRY)/eessi-pensjon-frontend-ui .

docker-push:
	$(DOCKER) tag $(REGISTRY)/eessi-pensjon-frontend-ui $(REGISTRY)/eessi-pensjon-frontend-ui:$(VERSION)
	$(DOCKER) push $(REGISTRY)/eessi-pensjon-frontend-ui:$(VERSION)

tag:
	$(eval VERSION=$(shell echo $$(($(VERSION) + 1))))
	$(GIT) tag -a $(VERSION) -m "auto-tag from Makefile"

manifest:
	$(NAIS) upload --app eessi-pensjon-frontend-ui -v $(VERSION)
