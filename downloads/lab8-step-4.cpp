#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Student {
    string name;
    int score;
};

int main() {
    vector<Student> students(3);
    for (int i = 0; i < 3; i++) {
        cin >> students[i].name;
        cin >> students[i].score;
    }
    cout << "All:\n";
    for (int i = 0; i < 3; i++) {
        cout << students[i].name << " "
             << students[i].score << "\n";
    }
    cout << "Passed:\n";
    for (int i = 0; i < 3; i++) {
        if (students[i].score ____ 60) {
            cout << students[i].name << " "
                 << students[i].score << "\n";
        }
    }
    return 0;
}
