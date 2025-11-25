# Use the lightweight Nginx image
FROM nginx:alpine

# Copy your static files to the Nginx html folder
# This puts index.html and all your assets where Nginx expects them
COPY . /usr/share/nginx/html

# Expose port 80 (Standard web traffic port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
