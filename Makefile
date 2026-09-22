MAKEFLAGS += --silent
ifndef ENV
ENV := dev
# ENV := uat
# ENV := production
endif

ifeq ($(ENV), dev)
ACCESS_TOKEN := 'Bearer eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIn0.Cy21pc_wwc048vj9Onu1dqe8idczd4NNrvm4hAd0I4duxbxTj7uq0DKvK8_f-VMRZuHnCGKFQ_RzpcLDut7secLMqgRpKQ8F-yxDvOMeMsF-V7OrbcL_MrRc6J6JVDflt2_yyhf4DdAPWh9MutPVcWk7GpP1KOtSiqmhTntMJuLffI6ZWaWjX51qlhQ33tgxseQDm_BsEhga354Zd9g91J2DFtNswI4h8DW_7lbrNY-fHbW9Ogz6KCDv5zkMOht8RtoQ5O09x0UUE_SoN1UWQt74vT4hzc-rBUaBLbpeL-UzF6INaK_JF_WBOeoSJL-eUbMnLypCQRm5k6O2Ayz8hg.zeF4OZRkcwzzCOEeU5gVOg.ZAZhqb_Tqa1L7NE2A0hezwvf9fzKUqzvs1Z-QfFjUKHvErwJBo-cVQC3swwMt14IauKeO3ea2ncYMHcrOxuNOJElMo3VPnJHx48WUv4B2Hu-2W8vdvwfGnO-MwzK8Gep0DxIZp7kyQozzrq5ybXMLe_zoPjM-G0T9FKzXUxWsb1tUMYqw_lvadhUQRUtq6YE_BzeqVa_fx9j1FOMF69dIYNV1FSiXlzFJBUJCNPaMaUtF7Y5u7lts6n6ebj88joTd6fN7dFZXcVuUuOVv1q1Zb5M0OxNELLCUw5KehhkOlwXLmBkOy6wFZOS9iEWlHNA91Ku3onprsPrdxLQeCNx8NPEW0WlDQuHK3r6zWU-j8d2nhkqU4hIrTknEZvZw-ytf9VoPBSteoBr8mucVr0A1fT489208VyktEJDogkZ9cQ.jsPM-KNOyR3dhHAiGNFaoap83ohZKf6LSri9hJZgJS8'
HOST_NAME := 'https://dev-web.gonuclei.com'
else ifeq ($(ENV), uat)
ACCESS_TOKEN := 'Bearer eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIn0.GjzzQxmnJeBnxvL8kN1_0qWF5IJ_naEeodvOJUItN4O3zE6Wiah3KTKEdIQ9JawpNwDh7JE1UwNO17PNU6dqIPA1mexZvr05MYpUW6tYbyyCJin5denS_VU8MXnQCq1c8r73T2UYXWBr5Xb_2uh3J1IPij_4J6b3P8G8sagls1said0fcSj5XUexVkDk8yWO227AuNivkAxui1-Dw0xOVbOqU7sgVKav0t6GD7Gwl54u699n4J_Dz_6EB94KnxVyG4NsGYCLZhHBhLCpbI_-81TLSu_Mb57EM4MZLcVfN9ldytQ9c962Jq9KBWDIcvMvHS8-bZTLG2TNZoRm_e3hGQ.NIFouC5kZ_HvzFCI8nq7zg.0nEbv8niUq3-QLGhY7hT7EtL7F9klGhwb4OaQ-9RFLP5SKhXIVKIgGHKpjsSQ1BmWKHUEUyKFqHZng539uOUYiCy69LY74C21dNE1TA_4S5ktcnJMpOPfuOT1c7GTgjpmNJexdvPW2XWlqBrqhQrgbh0l2_VKpyf4Wpi4uSLJ55SWtuZ8bb-8dvbC2Pdkm0aIrCQYtU66MInD212IG8lBfNxuwYy6HAaxIudI-yCGPhGGcOtXu2AiPUGwPJmr5w00uQm7CydZiIYQzyiUckw2kxNwYFsaQAOJ6HnltmQc1G5wrNgAJzFd7dTeUS56-qUFrG6O-tJm15URcCtC5OzQb93o_Eza2Y167O8XlAMpZp7dbxb9B5rnCtOgnZyy7WPJKaXXMBz90tONFI6mt2xuHfYnWk26ITEGZEXJtnwFCSdXMIC4MypTWBP1gB02Oe5.X8upVfcsSO1GoZpIR5W6eKn32GS1M9DruGyz5IGrEyo'
HOST_NAME := 'https://uat-web.gonuclei.com'
else ifeq ($(ENV), production)
ACCESS_TOKEN := ''
HOST_NAME := 'https://production-web.gonuclei.com'
else ifeq ($(ENV), uae-production)
ACCESS_TOKEN := ''
HOST_NAME := 'https://prod-rest-api-uae.gonuclei.com'
endif

# Set GITHUB_USERNAME as a env variable if you are running locally.

# Set GITHUB_TOKEN as a env variable if you are running locally.

ifndef TAG
TAG := $(shell git rev-parse HEAD)
endif

ifndef KUBECONFIG
KUBECONFIG := "${HOME}/.kube/config"
endif

ifndef DOCKER_REGISTRY
DOCKER_REGISTRY := stagingnuclei01.azurecr.io
# DOCKER_REGISTRY := preprodregistry01.azurecr.io
# DOCKER_REGISTRY := nucleiregistry.azurecr.io
endif

ifndef NAMESPACE
NAMESPACE := mwa-nuclei
endif

ifndef CHART_DIR
CHART_DIR := charts
endif

ifndef HELM_RELEASE_TAG
HELM_RELEASE_TAG := dev
endif

ifndef SERVICE_NAME
SERVICE_NAME := mwa-nuclei-flights
endif

ifndef SERVICE_TYPE
SERVICE_TYPE := universal
# SERVICE_TYPE := safari11
endif

ifndef PLATFORM
PLATFORM := amd64
endif

ifndef SERVICE_PREFIX
SERVICE_PREFIX := flights-base
endif

TARGET_URL := "https://nuclei-mwa-${ENV}.gonuclei.com/${SERVICE_PREFIX}/${HELM_RELEASE_TAG}/flights/$$FIRST_ROUTE_PAGE"

.PHONY: cache-landing
cache-landing:
	python3 cache.py ${TARGET_URL}

.PHONY: get-target-url
get-target-url:
	echo ${TARGET_URL}

.PHONY: readiness-check
readiness-check:
	kubectl rollout status --watch --timeout=120s deployment/${SERVICE_NAME}-${SERVICE_TYPE}-${HELM_RELEASE_TAG} -n ${NAMESPACE} --kubeconfig=${KUBECONFIG}       
	
.PHONY: helm-lint
helm-lint:
	helm lint 											\
		${CHART_DIR} 									\
		-f configs/${SERVICE_TYPE}/${ENV}/values.yaml 	

.PHONY: helm-render
helm-render:
	helm template                         \
		${SERVICE_NAME}-${SERVICE_TYPE}-${HELM_RELEASE_TAG} \
		${CHART_DIR}                        \
		-f configs/${SERVICE_TYPE}/${ENV}/values.yaml       \
		--validate                          \
		-n ${NAMESPACE}                     \
		--set image.tag=${TAG}              \
		--set image.repository=${SERVICE_NAME}-${SERVICE_TYPE}-${PLATFORM}         \
		--set nameOverride=${SERVICE_NAME}-${SERVICE_TYPE}-${HELM_RELEASE_TAG}     \
		--set fullnameOverride=${SERVICE_NAME}-${SERVICE_TYPE}-${HELM_RELEASE_TAG} \
		--set istio.match.uri[0].format=prefix                                     \
		--set istio.match.uri[0].value=/${SERVICE_PREFIX}/${HELM_RELEASE_TAG}      \
		--set readinessProbe.httpGet.path=/${SERVICE_PREFIX}/${HELM_RELEASE_TAG}/readyz \
		--set istio.destination.safari11.host=${SERVICE_NAME}-safari11-${HELM_RELEASE_TAG} \
		--kubeconfig=${KUBECONFIG}        

.PHONY: update-vite-env
update-vite-env:
	sh update.env.sh ${ENV} ${ACCESS_TOKEN} ${HOST_NAME}; \
	echo ".env" ; cat .env; echo ".env.local" ; cat .env.local

.PHONY: build-image
build-image:
	docker build                                               \
		--platform linux/${PLATFORM}                             \
		-f ${SERVICE_TYPE}/Dockerfile                                            \
		-t ${DOCKER_REGISTRY}/${SERVICE_NAME}-${SERVICE_TYPE}-${PLATFORM}:${TAG} \
		--build-arg VCS_REF=${TAG}                               \
		--build-arg BUILD_DATE=`date -u +”%Y-%m-%dT%H:%M:%SZ”`   \
		--build-arg NPM_PACKAGE_PUBLISH_TOKEN=${NPM_PACKAGE_PUBLISH_TOKEN}  \
		.

.PHONY: image-ref
image-ref:
	echo "IMAGE_REF=${DOCKER_REGISTRY}/${SERVICE_NAME}-${SERVICE_TYPE}-${PLATFORM}:${TAG}" >> $$GITHUB_ENV

.PHONY: publish-image
publish-image:
	docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}-${SERVICE_TYPE}-${PLATFORM}:${TAG}

.PHONY: publish-chart
publish-chart:
	helm chart save charts/ ${DOCKER_REGISTRY}/charts/${SERVICE_NAME}:${TAG}
	helm chart push ${DOCKER_REGISTRY}/charts/${SERVICE_NAME}:${TAG}

.PHONY: import-chart
import-chart: 
	helm chart pull ${DOCKER_REGISTRY}/charts/${SERVICE_NAME}:${TAG}
	helm chart export ${DOCKER_REGISTRY}/charts/${SERVICE_NAME}:${TAG} -d ephemeral
	
.PHONY: deploy-service
deploy-service: 
	helm upgrade                          \
		${SERVICE_NAME}-${SERVICE_TYPE}-${HELM_RELEASE_TAG} \
		${CHART_DIR}                        \
		--version ${TAG}                    \
		--install                           \
		-f configs/${SERVICE_TYPE}/${ENV}/values.yaml       \
		-n ${NAMESPACE}                     \
		--set image.tag=${TAG}              \
		--set image.repository=${SERVICE_NAME}-${SERVICE_TYPE}-${PLATFORM}         \
		--set nameOverride=${SERVICE_NAME}-${SERVICE_TYPE}-${HELM_RELEASE_TAG}     \
		--set fullnameOverride=${SERVICE_NAME}-${SERVICE_TYPE}-${HELM_RELEASE_TAG} \
		--set istio.match.uri[0].format=prefix                                     \
		--set istio.match.uri[0].value=/${SERVICE_PREFIX}/${HELM_RELEASE_TAG}      \
		--set readinessProbe.httpGet.path=/${SERVICE_PREFIX}/${HELM_RELEASE_TAG}/readyz \
		--set istio.destination.safari11.host=${SERVICE_NAME}-safari11-${HELM_RELEASE_TAG} \
		--kubeconfig=${KUBECONFIG}     

.PHONY: remove-service
remove-service: 
	helm uninstall                          \
		${SERVICE_NAME}-${SERVICE_TYPE}-${HELM_RELEASE_TAG} \
		-n ${NAMESPACE}                     \
		--kubeconfig=${KUBECONFIG}     
