import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AI Study Assistant API",
            version: "1.0.0",
            description: "API for chat, summarize, and quiz endpoints.",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
        paths: {
            "/chat": {
                post: {
                    summary: "Chat with AI",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" },
                                    },
                                    required: ["message"],
                                },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Chat response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            result: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { description: "Invalid request" },
                        "500": { description: "Server error" },
                    },
                },
            },
            "/summarize": {
                post: {
                    summary: "Summarize text",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        text: { type: "string" },
                                    },
                                    required: ["text"],
                                },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Summary response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            result: {
                                                type: "object",
                                                properties: {
                                                    summary: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { description: "Invalid request" },
                        "500": { description: "Server error" },
                    },
                },
            },
            "/quiz": {
                post: {
                    summary: "Generate quiz questions",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        text: { type: "string" },
                                    },
                                    required: ["text"],
                                },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Quiz response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            questions: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        question: { type: "string" },
                                                        answer: { type: "string" },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { description: "Invalid request" },
                        "500": { description: "Server error" },
                    },
                },
            },
            "/models": {
                get: {
                    summary: "List available Gemini models",
                    responses: {
                        "200": {
                            description: "List of models",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            models: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        name: { type: "string" },
                                                        supportedGenerationMethods: {
                                                            type: "array",
                                                            items: { type: "string" },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": { description: "Server error" },
                    },
                },
            },
        },
    },
    apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
