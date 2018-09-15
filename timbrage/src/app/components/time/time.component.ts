import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Time} from "../../models/time.model";

@Component({
    selector: 'app-time',
    templateUrl: './time.component.html',
    styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {

    @Input() public time: Time;

    public hours = [];
    public minutes = [];

    public form: FormGroup;

    editing = false;

    constructor(private fb: FormBuilder) {
        for (let i = 0; i < 24; i++) {
            this.hours.push(i);
        }
        for (let i = 0; i < 60; i++) {
            this.minutes.push(i);
        }
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            hours: ['', Validators.required],
            minutes: ['', Validators.required]
        });
    }

    ngOnInit() {
    }

    public startEditing() {
        this.editing = true;
        this.form.setValue({hours: this.time.hours, minutes: this.time.minutes});
    }

    public onSubmit() {
        this.time.hours = this.form.value.hours;
        this.time.minutes = this.form.value.minutes;
        this.editing = false;
    }

    public revert() {
        this.editing = false;
    }
}
