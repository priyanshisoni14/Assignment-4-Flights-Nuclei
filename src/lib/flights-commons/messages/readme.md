# Flights Messages

Messages contains typescript interfaces to provide type safety. 
In order to generate typescript interfaces follow these steps:
- Refer to protorepo with Flights package with lates version
- Distinguish protos based on request and repsonse for a particular API. 
- Convert protos to typescript interface using *ChatGPT* in camelCase.
- Copy the formed interfaces, review them once into `api_name.msg.ts`, example `config.msg.ts`.
