// ============ SWAGGER/OPENAPI DOCUMENTATION ============
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BioGas Authentication API',
      version: '1.0.0',
      description: 'Complete authentication backend for BioGas project with JWT and role-based access',
      contact: {
        name: 'BioGas Team',
        email: 'support@biogas.com'
      },
      license: {
        name: 'ISC'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using Bearer scheme. Example: "Authorization: Bearer {token}"'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            phone: {
              type: 'string',
              nullable: true,
              description: 'User phone number'
            },
            avatar: {
              type: 'string',
              nullable: true,
              description: 'User avatar URL'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            age: {
              type: 'integer',
              nullable: true,
              description: 'User age'
            },
            bio: {
              type: 'string',
              nullable: true,
              description: 'User biography'
            },
            isVerified: {
              type: 'boolean',
              description: 'Email verification status'
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Last login timestamp'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/authRoutes.js',
    './src/routes/userRoutes.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
