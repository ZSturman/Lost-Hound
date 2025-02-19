import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Lost & Hound API",
        version: "1.0.0",
        description: "List of all APIs used in the Lost & Hound Application",
    },
};

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js", "index.js"], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
