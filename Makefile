DOCKER  := docker
NPM     := npm
NAIS    := nais
GIT     := git
VERSION := $(shell cat ./VERSION)
REGISTRY:= repo.adeo.no:5443

.PHONY: all build docker docker-push release manifest

all: build docker
release: tag docker-push

build:
	$(NPM) install
	$(NPM) run build

docker:
	$(NAIS) validate --file nais.yaml
	$(DOCKER) build --pull -t $(REGISTRY)/eessi-pensjon-saksbehandling-ui -f Dockerfile .

docker-push:
	$(DOCKER) tag $(REGISTRY)/eessi-pensjon-saksbehandling-ui $(REGISTRY)/eessi-pensjon-saksbehandling-ui:$(VERSION)
	$(DOCKER) push $(REGISTRY)/eessi-pensjon-saksbehandling-ui:$(VERSION)

bump-version:
	@echo $$(($$(cat ./VERSION) + 1)) > ./VERSION

tag:
	git add VERSION
	git commit -m "Bump version to $(VERSION) [skip ci]"
	git tag -a $(VERSION) -m "auto-tag from Makefile"

manifest:
	$(NAIS) upload --app eessi-pensjon-saksbehandling-ui -v $(VERSION) --file nais.yaml
