# LunarHQWebApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

Discord Client ID: 959099639309664266
Discord Client Secret: faSDqlERiSFLh_M2zSC3KsPumITPAUiC

MetaMask : QPjDZe9=XaIf

right acquire denial wheel fade letter person ripple kick pizza tool alarm


```
docker build -t rippler-core .
``` 

##### Run docker container

```
docker run -it -d -v <project_path>:/application -p <port_number>:<port_number> --name <container_name> <image_name>
docker run -it -d -v /root/application/:/application -p 80:80 -p 443:443 --name app_name rippler-core
```

##### Interact with running docker container

###### windows

```
docker exec -it <container_name> bash
```

###### linux

```
docker exec -it app_name bash 
```

### PM2 to start instance

```
pm2 install typescript
pm2 start --interpreter ts-node src/server.ts
pm2 start src/server.ts --interpreter-args="--project tsconfig.json"
```

#### Apache Proxy Config

- To configure
  Reference [link](https://medium.com/@sumitnair89/configure-apache-with-node-js-application-on-aws-ubuntu-18-04-server-for-different-http-ports-4e6838c7357f)

`
vi /etc/apache2/sites-available/rippler.conf
`

```
<VirtualHost *:80>
    ProxyRequests off
    
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>
    
    <Location />
        ProxyPass http://localhost:7000/
        ProxyPassReverse http://localhost:7000/
    </Location>
</VirtualHost>
```

#### Activate Configuration

```
a2ensite rippler.conf
a2dissite 000-default.conf
```

#### test configuration

```
apachectl configtest
```

#### reload new apache configuration

```
service apache2 reload
```

##### Generate private key

```
openssl req -nodes -newkey rsa:2048 -keyout <domain.com>.key -out <domain.com>.csr
```

##### Apache conf for SSL

```
<VirtualHost *:80>
    Redirect permanent / https://rippler.whyable.com/
</VirtualHost>
<VirtualHost *:443>
    SSLEngine on
    ProxyPass / http://localhost:7000/
    ProxyPassReverse / http://localhost:7000/
    ServerName rippler.whyable.com:443
    ServerAlias www.rippler.whyable.com
    SSLCertificateKeyFile /application/ssl/rippler.whyable.com.key
    SSLCertificateFile /application/ssl/a7bdcf5ede0b4764.crt
    SSLCertificateChainFile /application/ssl/gd_bundle-g2-g1.crt
</VirtualHost>
```
