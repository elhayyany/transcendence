FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
# RUN rm -rf /usr/share/nginx/html/*
# COPY ./build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
