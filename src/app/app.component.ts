import { Component, OnInit, Optional } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Pair } from './pair';
import { PairService } from './pair.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public products: Pair[];
  public editProduct?: Pair;
  public deleteProduct: Pair;

  constructor(private productService: PairService){ this.products = [];}

  ngOnInit() {
    this.getProducts();
  }

  public getProducts(): void {
    this.productService.getPairs().subscribe(
      (response: Pair[]) => {
        this.products = response;
        console.log(this.products);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeletePair(productId: string): void {
    this.productService.deletePair(productId).subscribe(
      (response: void) => {
        console.log(response);
        this.getProducts();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onOpenModal(product: Pair, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addProductModal');
    }
    if (mode === 'delete') {
      this.deleteProduct = product;
      button.setAttribute('data-target', '#deleteProductModal');
    }
    container.appendChild(button);
    button.click();
  }

  public searchPairs(id: string): void {
    console.log(id);
    const results: Pair[] = [];
    for (const product of this.products) {
      if (product.key.toLowerCase().indexOf(id.toLowerCase()) !== -1) {
        results.push(product);
      }
    }
    this.products = results;
    if (results.length === 0 || !id) {
      this.getProducts();
    }
  }

  public onAddPair(addForm: NgForm): void {
    document.getElementById('add-product-form').click();
    this.productService.addPair(addForm.value).subscribe(
      (response: Pair) => {
        console.log(response);
        this.getProducts();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }
}
