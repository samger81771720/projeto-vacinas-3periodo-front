import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rodape', //Esse atributo que define o nome que será usado na tag para referenciar o componente
                          //<app-rodape></app-rodape>
//standalone: true, // explicação no final
  templateUrl: './rodape.component.html',
  styleUrls: ['./rodape.component.scss']
})
export class RodapeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

/*

Standalone: true: Torna o componente autônomo, permitindo importá-lo diretamente em outros componentes sem precisar de um módulo.

Sem standalone: true: O componente precisa estar declarado em um módulo (como AppModule) e ser importado via esse módulo. Não pode ser importado diretamente por outros componentes.

"Resumo"

Com standalone: true: O RodapeComponent é autônomo e pode ser importado diretamente em qualquer outro componente.
Sem standalone: true: O RodapeComponent precisa ser declarado em um módulo (RodapeModule), e esse módulo deve ser importado onde o RodapeComponent será usado.


"Explicação mais detalhada:"

https://chatgpt.com/c/7eb7dec0-6e21-4607-b8dc-df4f44b6e8a9

*/

