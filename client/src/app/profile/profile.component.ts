import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  userData: Record<string, any> = {};
  isFormShowed = false;

  posts: Record<string, any>[] = [];

  postForm = this.formBuilder.group({
    text: '',
  });

  constructor(
    private userService: UserService,
    private postService: PostService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.userService.getUserData().subscribe((data) => {
      this.userData = data;
      this.fetchPost();
    });
  }

  toggleForm() {
    this.isFormShowed = !this.isFormShowed;
  }

  onSubmit() {
    this.postService.createPost(this.postForm.value).subscribe();
    this.postForm.reset();
  }

  fetchPost() {
    if (!this.userData['_id']) {
      this.userService.getUserData().subscribe((data) => {
        this.userData = data;
      });
    }

    this.postService.fetchMyPost(this.userData['_id']).subscribe((data) => {
      this.posts = data;
    });
  }
  upvote(post: any) {
    const userId = this.userData['_id'];
    if (post.upvotes.includes(userId)) {
      post.upvotes = post.upvotes.filter((id: string) => id !== userId);
    } else {
      post.upvotes.push(userId);
      post.downvotes = post.downvotes.filter((id: string) => id !== userId);
    }
    this.postService.upvote(post._id, this.userData['_id']).subscribe(() => {
      console.log('upvote added');
    });
  }

  downvote(post: any) {
    const userId = this.userData['_id'];
    if (post.downvotes.includes(userId)) {
      post.downvotes = post.downvotes.filter((id: string) => id !== userId);
    } else {
      post.downvotes.push(userId);
      post.upvotes = post.upvotes.filter((id: string) => id !== userId);
    }
    this.postService.downvote(post._id, this.userData['_id']).subscribe(() => {
      console.log('downvote added');
    });
  }
}
