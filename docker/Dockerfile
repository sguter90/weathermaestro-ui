# Stage 1: Build the application
FROM node:lts-alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
# Use npm ci for clean install based on package-lock.json
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/weathermaestro-ui.conf

# Copy the config.js template
COPY public/config.js /usr/share/nginx/html/config.js.template

# Use a custom entrypoint to substitute environment variables
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

# Copy the built application files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
