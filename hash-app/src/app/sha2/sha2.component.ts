import { CommonModule } from "@angular/common"
import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-sha2",
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: "./sha2.component.html",
  styleUrls: ["./sha2.component.css"],
})
export class Sha2Component {
    faArrowRight = faArrowRight;
  
    constructor(private router: Router) {}
  
    navigateToTextInput() {
      this.router.navigate(['/sha2-simulator']);
    }
}

