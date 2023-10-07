FROM nginx
# COPY ./default.conf /etc/nginx/conf.d/default.conf
# RUN rm -rf /usr/share/nginx/html/*
# COPY ./build /usr/share/nginx/html
RUN echo "sleep 15 && nginx -g 'daemon off;'" > init.sh
RUN chmod +x init.sh
CMD ["bash", "init.sh"]init.sh