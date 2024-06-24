import swaggerJsDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Comprehensive Online Bookstore and Library Platform API',
            version: '1.0.0',
            description: 'API documentation for user authentication and book management',
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
                Book: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        author: { type: 'string' },
                        description: { type: 'string' },
                        genre: {
                            type: 'string',
                            enum: [
                                'Fiction',
                                'Non-Fiction',
                                'Fantasy',
                                'Science Fiction',
                                'Mystery',
                                'Thriller',
                                'Romance',
                                'Historical Fiction',
                                'Biography',
                                'Autobiography',
                                'Self-Help',
                                'Philosophy',
                                'Travel',
                                'Cookbooks',
                                'Poetry',
                                'Drama',
                                'Children',
                                'Young Adult',
                            ],
                        },
                        quantity: { type: 'number' },
                        price: { type: 'number' },
                        publisherDate: { type: 'string', format: 'date' },
                        isbn: { type: 'string' },
                        coverImage: { type: 'string' },
                    },
                    required: ['title', 'author', 'description', 'genre', 'quantity', 'price', 'publisherDate', 'isbn', 'coverImage'],
                },
            },
        },
    },
    apis: ['./routes/authRoutes.ts', './routes/bookRoutes.ts'], // Paths to your route files
};

export const specs = swaggerJsDoc(options);
