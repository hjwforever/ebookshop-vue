FROM nginx:stable-alpine
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN rm -rf /usr/share/nginx/html/*
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# FROM node:12-alpine AS build-stage
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# FROM nginx:stable-alpine AS production-stage
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# COPY --from=build-stage /app/dist /usr/share/nginx/html

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]





# FROM node:lts-alpine as build-stage
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .

# ENV CI=true
# ENV PORT=8000

# RUN npm run build

# FROM nginx:stable-alpine as production-stage
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# COPY --from=build-stage /app/dist /usr/share/nginx/html

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]




# FROM nginx:stable-alpine
# COPY dist/ /usr/share/nginx/html/
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
