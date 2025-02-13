import { CommonModule } from "@angular/common"
import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-md5",
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: "./md5.component.html",
  styleUrls: ["./md5.component.css"],
})
export class Md5Component {
  faArrowRight = faArrowRight;

  constructor(private router: Router) {}

  navigateToTextInput() {
    this.router.navigate(['/md5-simulator']);
  }
}