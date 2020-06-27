# Team Contribution Guidelines

1. Create a branch separate from `master` with a name relating to your task.
```
git checkout -b sample-branch-name
```

2. Add your code.

3. Push your code to your branch.
```
git add .
git commit -m "Generate a list of courses"
git push origin sample-branch-name
```

4. Go to this repository on GitHub, click on the green button that says compare branches.

5. Submit and pull request and try to get at least one other person to approve your changes before clicking the button that says 'Merge'.

6. Delete remote branch on GitHub after merging. 

7. Delete your local branch and update local master by using the commands
```
git checkout master
git branch -D sample-branch-name
git pull origin master
```
