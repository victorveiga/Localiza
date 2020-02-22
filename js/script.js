/*
*****************************************
* DEVELOPER: VICTOR VEIGA               *
* EMAIL: victorl.veigapro@gmail.com     *
* DATA: 15/02/2020                      *
* OBJETIVO: Localizar CEP               *
*****************************************

INFORMAÇÕES:  

API do IBGE
https://servicodados.ibge.gov.br/api/docs/localidades

Lista de cidades por uf: https://servicodados.ibge.gov.br/api/v1/localidades/estados/33/municipios
Lista de estados: https://servicodados.ibge.gov.br/api/v1/localidades/estados

API ViaCEP:
https://viacep.com.br/

*****************************************************************************************************/

/* Variáveis Globais 
-------------------------*/
var xEstados = SetEstados();
var xCidades;

/* Funções
------------------------- */

function Busca() {
    if ($('#tabela').length){
      $('#tabela').remove();
    }

    id = document.getElementById('sltEstados').value;

    if (id.length > 2){
      alert('Informe um estado brasileiro antes de continuar...')
      return false;
    }

    estado = xEstados[id]['sigla'];
    BuscaPorEstado(estado)
}

function BuscaPorEstado(uf) {
    for (const key in xCidades) {
      if (xCidades.hasOwnProperty(key)) {
        BuscaPorCidade(uf,xCidades[key])
      }
    }
}

function BuscaPorCidade(uf,cidade) {
    var endereco = $("#edtBusca").val();
    var link     = "https://viacep.com.br/ws/"+uf+"/"+cidade+"/"+endereco+"/json/";

    $.getJSON(link, function(obj){

        $.each(obj, function(indice, objEstado){
            MontaDados(objEstado)
        });
    });
}

function CriaTabela() {
    
    var tabela = ' <table id="tabela" class="table table-striped table-sm"> ' 
                +'   <thead class="thead-light">         ' 
                +'     <tr>                              '
                +'       <th scope="col">#</th>          '
                +'       <th scope="col">UF</th>         '
                +'       <th scope="col">Cidade</th>     '
                +'       <th scope="col">Bairro</th>     '
                +'       <th scope="col">Logradouro</th> '
                +'       <th scope="col">Cep</th>        '
                +'     </tr>                             '
                +'   </thead>                            '
                +'   <tbody>                             '
                +'   </tbody>                            '
                +' </table>                              ';

    $('#conteudo').append(tabela);
}

function MontaDados(objeto) {

    if (objeto['logradouro'] === '')
        return false;

    // Verificar se existe a tabela
    if ( !document.getElementById('tabela') )
        CriaTabela();

    var colunas = '<td scope="row"></td>'
                 +'<td>'+objeto['uf']+'</td>'
                 +'<td>'+objeto['localidade']+'</td>'
                 +'<td>'+objeto['bairro']+'</td>'
                 +'<td>'+objeto['logradouro']+'</td>'
                 +'<td>'+objeto['cep']+'</td>';

    $('#tabela tbody').append('<tr>'+colunas+'</tr>')
}

function SetEstados() {

    var auxEstados = new Array();

    $.getJSON('https://servicodados.ibge.gov.br/api/v1/localidades/estados', function(obj){

        $.each(obj, function(indice, objEstado){

          var estado      = new Array();
          var id          = objEstado['id'   ];
          estado['sigla'] = objEstado['sigla'];
          estado['nome' ] = objEstado['nome' ];
          
          auxEstados[id]  = estado;
        });
    });

    return auxEstados
}

function PreparaSelecaoEstados() {

    selecao = document.getElementById('sltEstados');

    for (const key in xEstados) {
        const element = xEstados[key];
        //selecao.options.add(new Option(element['nome'],element['sigla']));
        selecao.options.add(new Option(element['nome'],key));
    }
}

function PreparaCidades(pEstado) {

  if (pEstado <= 0)
      return false;

  xCidades = new Array();

  $.getJSON('https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+pEstado+'/municipios', function(obj){
      $.each(obj, function(indice, objEstado){
          xCidades[indice] = objEstado['nome'];
      });
  });

}