#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int score;
};

int main() {
    Student student;
    student.name = "Ali";
    student.score = ____;
    cout << student.name << " "
         << student.score << "\n";
    return 0;
}
