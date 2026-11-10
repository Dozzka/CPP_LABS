#include <iostream>
#include <vector>
using namespace std;

bool isComfortable(int t) {
    return t >= 18 && t <= 26;
}

int main() {
    vector<int> temperature(7);
    for (int i = 0; i < 7; i++) {
        cin >> temperature[i];
    }
    cout << "Data:";
    for (int i = 0; i < 7; i++) {
        cout << " " << temperature[i];
    }
    cout << "\n";
    int comfortable = 0;
    int sum = 0;
    for (int i = 0; i < 7; i++) {
        sum += ____;
        if (isComfortable(temperature[i])) {
            comfortable++;
        }
    }
    cout << "Sum: " << sum << "\n";
    cout << "Comfortable: " << comfortable << "\n";
    return 0;
}
