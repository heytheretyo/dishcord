import { Component, NgModule } from '@angular/core';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore.component.html',
})
export class ExploreComponent {
  userData: Record<string, any> = {};
  isFormShowed = false;

  posts: Record<string, any>[] = [];
  usersCache: Record<string, any> = {};

  constructor(
    private userService: UserService,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getUserData().subscribe((data) => {
      this.userData = data;
      this.fetchPosts();
    });
  }

  fetchPosts() {
    this.postService.fetchPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  upvote(post: any) {
    const userId = this.userData['_id'];

    if (!userId) {
      this.router.navigate(['/']);
      return;
    }

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

    if (!userId) {
      this.router.navigate(['/']);
      return;
    }

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
