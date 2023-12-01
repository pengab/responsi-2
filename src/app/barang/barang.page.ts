import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-barang',
  templateUrl: './barang.page.html',
  styleUrls: ['./barang.page.scss'],
})
export class BarangPage implements OnInit {
  dataBarang: any = [];
  id: number | null = null;
  nama: string = '';
  deskripsi: string = '';
  modal_tambah: boolean = false;
  modal_edit: boolean = false;

  constructor(
    private _apiService: ApiService,
    private modal: ModalController,
    private router: Router  // Injeksi Router
  ) {}

  ngOnInit() {
    this.getBarang();
  }

  getBarang() {
    this._apiService.tampil('tampilBarang.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataBarang = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  reset_model() {
    this.id = null;
    this.nama = '';
    this.deskripsi = '';
  }

  cancel() {
    this.modal.dismiss();
    this.modal_tambah = false;
    this.reset_model();
  }

  open_modal_tambah(isOpen: boolean) {
    this.modal_tambah = isOpen;
    this.reset_model();
    this.modal_tambah = true;
    this.modal_edit = false;
  }

  open_modal_edit(isOpen: boolean, idget: any) {
    this.modal_edit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilBarang(this.id);
    this.modal_tambah = false;
    this.modal_edit = true;
  }

  tambahBarang() {
    if (this.nama != '' && this.deskripsi != '') {
      let data = {
        nama: this.nama,
        deskripsi: this.deskripsi,
      };
      this._apiService.tambah(data, '/tambahBarang.php').subscribe({
        next: (hasil: any) => {
          this.reset_model();
          console.log('berhasil tambah Barang');
          this.getBarang();
          this.modal_tambah = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal tambah Barang');
        },
      });
    } else {
      console.log('gagal tambah Barang karena masih ada data yg kosong');
    }
  }

  hapusBarang(id: any) {
    this._apiService.hapus(id, '/hapusBarang.php?id=').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.getBarang();
        console.log('berhasil hapus data');
      },
      error: (error: any) => {
        console.log('gagal');
      },
    });
  }

  ambilBarang(id: any) {
    this._apiService.lihat(id, '/lihatBarang.php?id=').subscribe({
      next: (hasil: any) => {
        console.log('sukses', hasil);
        let Barang = hasil;
        this.id = Barang.id;
        this.nama = Barang.nama;
        this.deskripsi = Barang.deskripsi;
      },
      error: (error: any) => {
        console.log('gagal ambil data');
      },
    });
  }

  editBarang() {
    let data = {
      id: this.id,
      nama: this.nama,
      deskripsi: this.deskripsi,
    };
    this._apiService.edit(data, 'editBarang.php').subscribe({
      next: (hasil: any) => {
        console.log(hasil);
        this.reset_model();
        this.getBarang();
        console.log('berhasil edit Barang');
        this.modal_edit = false;
        this.modal.dismiss();
      },
      error: (err: any) => {
        console.log('gagal edit Barang ' + err.message);
      },
    });
  }

  logout() {
    // Lakukan proses logout seperti membersihkan token atau sesi yang ada
    // Misalnya, menghapus token dari localStorage
    localStorage.removeItem('token-saya');
    localStorage.removeItem('namasaya');

    // Redirect ke halaman login
    this.router.navigate(['/login']);
  }
}
