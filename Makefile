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
	$(NAIS) validate --file nais-fss.yaml
	$(NAIS) validate --file nais-sbs.yaml
	$(DOCKER) build --pull -t $(REGISTRY)/eessi-pensjon-frontend-ui-fss -f Dockerfile_Fss .
	$(DOCKER) build --pull -t $(REGISTRY)/eessi-pensjon-frontend-ui-sbs -f Dockerfile_Sbs .

docker-push:
	$(DOCKER) tag $(REGISTRY)/eessi-pensjon-frontend-ui-fss $(REGISTRY)/eessi-pensjon-frontend-ui-fss:$(VERSION)
	$(DOCKER) push $(REGISTRY)/eessi-pensjon-frontend-ui-fss:$(VERSION)
	$(DOCKER) tag $(REGISTRY)/eessi-pensjon-frontend-ui-sbs $(REGISTRY)/eessi-pensjon-frontend-ui-sbs:$(VERSION)
	$(DOCKER) push $(REGISTRY)/eessi-pensjon-frontend-ui-sbs:$(VERSION)

bump-version:
	@echo $$(($$(cat ./VERSION) + 1)) > ./VERSION

tag:
	git add VERSION
	git commit -m "Bump version to $(VERSION) [skip ci]"
	git tag -a $(VERSION) -m "auto-tag from Makefile"

manifest:
	$(NAIS) upload --app eessi-pensjon-frontend-ui-fss -v $(VERSION) --file nais-fss.yaml
	$(NAIS) upload --app eessi-pensjon-frontend-ui-sbs -v $(VERSION) --file nais-sbs.yaml
