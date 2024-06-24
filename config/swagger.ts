import swaggerJsDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Comprehensive Online Bookstore and Library Platform API',
            version: '1.0.0',
            description: 'API documentation for user authentication and management',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', format: 'password' },
                        address: {
                            type: 'object',
                            properties: {
                                city: { type: 'string' },
                                street: { type: 'string' },
                                houseNumber: { type: 'string' },
                                apartmentNumber: { type: 'string' },
                                postalCode: { type: 'string' },
                                country: { type: 'string' },
                            },
                        },
                    },
                    required: ['firstName', 'lastName', 'username', 'email', 'password', 'address'],
                },
            },
        },
    },
    apis: ['./routes/authRoutes.ts'], // Ścieżka do pliku z trasami, tutaj authRoutes.ts
};

export const specs = swaggerJsDoc(options);
