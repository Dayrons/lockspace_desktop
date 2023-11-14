var pdf = require('html-pdf');
var fs = require('fs');
const path = require('path');
const axios = require('axios');
const https = require('https');

class VentasController {

    async realizarNota(e, id) {
      


        

        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        const responsePedido = await axios.get(`https://app.atvenezuela.com/api/pedido/${id}`,{ httpsAgent: agent });

        const pedido = responsePedido.data

        const responseUsuario = await axios.get(`https://app.atvenezuela.com/api/usuario/${pedido.id_usuario}`,{ httpsAgent: agent });
        
        const usuario  = responseUsuario.data
        const productos  = JSON.parse(pedido.productos)

        var projectRoot = process.cwd();
        projectRoot = projectRoot.replace(/\\/g, '/');
        var imgBase = 'file:///' + projectRoot + '/src/assets/';

        
    
        let filas = ''
        productos.forEach(producto => {
            filas += `
            <tr>
                <td>010101</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio}</td>
                <td>0</td>
                <td>$${producto.cantidad * producto.precio}</td>
            </tr>
          
            `
           
        });
        
        const options = {
            base: imgBase,
            localUrlAccess: true,
        }

      
        var contenido = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>PDF Result Template</title>
            <style>
                *{
                    font-family: Arial, Helvetica, sans-serif;
                }
                img{
                    width: 50px;
                    height: 50px;
                    object-fit: contain;
                }
                .cabecera{
                    text-align: center;
                
                }
                h1{
                    margin: 10px 0;
                    font-size: 16px;
                }
                h4{
                    margin: 10px 0;
                    font-size: 12px;
                }
                h5{
                    margin: 10px 0;
                    font-size: 10px;
                }
                table{
                    width: 100%;
                    border-collapse: collapse;
                }
                tr{
                    font-size: 10px;
                    text-align: left;
                    margin: 5px 0;
                }
                th{
                    font-size: 12px;
                    font-weight: bold;
                }
                tbody tr:nth-child(odd){
                    background: rgb(233, 233, 233);
                }
                thead{
                    border-bottom: solid 1px #ced6e0;
                
                }
                th{
                    padding: 10px 0;
                } 
                td{
                    
                    padding: 5px;
                    
                }
                
            </style>
        </head>
        <body>
            <div class="cabecera">
                <img src="./logo.png" alt="">
                <h1>ADVANTAGE TECHNOLOGY, C.A</h1>
                <h1>J-29665156-6</h1>
                <h4>AV BARALT CENTRO COMERCIAL DORAL BARALT LOCAL 271 PB</h4>
                <h4>(0212)481.69.77 / (0212)482.15.94 | WAPP:(0412)800.55.31 / (0412)626.5964</h4>
                <h4>atbaralt@gmail.com | www.atvenezuela.com | @at_venezuela</h4>
            </div>
            <div class="cliente">
                <h5>CLIENTE:${usuario.nombre + ' ' + usuario.apellido}</h5>
                <h5>TELEFONO:${usuario.telefono}</h5>
                <h5>RIF:${usuario.documento}</h5>
                <h5>DIRECCION:</h5> 
            </div>
            <table>
                <thead>
                    <tr>
                        <th>SERIAL</th>
                        <th>PRODUCTO</th>
                        <th>CANTIDAD</th>
                        <th>PRECIO U.</th>
                        <th>DESCUENTO</th>
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}

                </tbody>
                
                
            </table>
        </body>
        </html>
    
        `

        pdf.create(contenido,options).toFile('./nota.pdf', function (err, res) {
            if (err) {
                console.log(err);
            } else {    
                e.reply('nota-generada',res)
            }
        });
    }

}




module.exports = new VentasController()