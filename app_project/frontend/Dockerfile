FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ✅ Copy certificate & key to container 
COPY cert/localhost.crt /etc/nginx/conf.d/localhost.crt
COPY cert/localhost.key /etc/nginx/conf.d/localhost.key

# Copy Vue build output
COPY dist/ /usr/share/nginx/html/

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
