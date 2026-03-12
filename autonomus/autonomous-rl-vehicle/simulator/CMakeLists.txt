cmake_minimum_required(VERSION 3.16)
project(AutonomousVehicleSimulator)

set(CMAKE_CXX_STANDARD 17)

# Use SFML 2 from Homebrew on macOS
set(SFML_DIR "/opt/homebrew/opt/sfml@2/lib/cmake/SFML")
find_package(SFML 2.6 COMPONENTS graphics window system REQUIRED)

add_executable(${PROJECT_NAME} main.cpp)

target_link_libraries(${PROJECT_NAME} sfml-graphics sfml-window sfml-system)

target_include_directories(${PROJECT_NAME} PRIVATE "/opt/homebrew/opt/sfml@2/include")