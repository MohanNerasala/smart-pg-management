package com.staynest.util;

import com.staynest.model.PG;
import com.staynest.model.Room;
import com.staynest.model.Floor;
import com.staynest.repository.PGRepository;
import com.staynest.repository.RoomRepository;
import com.staynest.repository.FloorRepository;
import com.staynest.repository.UserRepository;
import com.staynest.model.User;
import com.staynest.model.Role;
import com.staynest.model.AuthProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;

import java.math.BigDecimal;

// @Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public void run(String... args) {
        // DEFINITIVE FIX: Run seeding in a BACKGROUND THREAD so Render doesn't kill the app for a 'startup timeout'
        new Thread(() -> {
            try {
                // Wait 10 seconds for the cloud connection to stabilize
                Thread.sleep(10000);
                performSeeding();
            } catch (Exception e) {
                System.err.println("DataSeeder: Background Seeding CRITICAL ERROR: " + e.getMessage());
            }
        }).start();
        System.out.println("DataSeeder: BACKGROUND SEEDING STARTED. Backend is now entering 'Ready' state.");
    }

    private void performSeeding() {
        try {
            // Exit early if data already seeded to avoid cloud timeouts
            if (userRepository.existsByEmail("admin@staynest.com")) {
                System.out.println("DataSeeder: Database already seeded. Skipping expensive bootstrap.");
                return;
            }
        } catch (Exception e) {
            System.err.println("DataSeeder: WARNING - Could not connect to Supabase to check seed status. Check your network! Continuing startup...");
            return; // Skip seeding if we can't connect, but DON'T crash the app.
        }

        try {
            System.out.println("DataSeeder: Checking database state...");
            
            // 0c. Ensure Admin User exists
            if (!userRepository.existsByEmail("admin@staynest.com")) {
                System.out.println("DataSeeder: Seeding Admin User...");
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@staynest.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setProvider(AuthProvider.LOCAL);
                userRepository.save(admin);
                System.out.println("DataSeeder: Admin User seeded successfully.");
            } else {
                System.out.println("DataSeeder: Admin User found. Force-resetting password to admin123...");
                User admin = userRepository.findByEmail("admin@staynest.com").get();
                admin.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(admin);
            }

            // Early exit if already populated to prevent 500 scrolling logs
            if (pgRepository.count() >= 10) {
                System.out.println("DataSeeder: PGs already fully seeded (count >= 10). Skipping slow loop expansion.");
                return;
            }

            // 1. Ensure PGs exist (Seed 1-110 to match analyzed local data)
            System.out.println("DataSeeder: Starting MASSIVE database population (110 PGs * 50 Rooms). This will run in background...");
            int pgCount = 0;
            for (long p = 1; p <= 110; p++) {
                final long pgId = p;
                PG pg = pgRepository.findById(pgId).orElseGet(() -> {
                    PG newPg = new PG();
                    newPg.setId(pgId);
                    newPg.setPgName("StayNest PG " + pgId);
                    newPg.setCity("Bangalore");
                    newPg.setState("Karnataka");
                    newPg.setArea("Marthahalli");
                    newPg.setAddress(pgId + " Luxury Lane, Bangalore");
                    newPg.setPrice(new BigDecimal("10000"));
                    newPg.setDescription("Premium accommodation.");
                    return pgRepository.save(newPg);
                });

                // 2. Ensure 5 Floors exist for each PG (Matches frontend f=1..5)
                for (int f = 1; f <= 5; f++) {
                    final int floorNum = f;
                    Floor floor = floorRepository.findAll().stream()
                            .filter(fl -> fl.getFloorNumber() == floorNum && fl.getPg().getId().equals(pg.getId()))
                            .findFirst()
                            .orElseGet(() -> {
                                Floor newFloor = new Floor();
                                newFloor.setFloorNumber(floorNum);
                                newFloor.setPg(pg);
                                return floorRepository.save(newFloor);
                            });

                    // 3. Ensure 10 Rooms exist for this floor (Matches frontend r=1..10)
                    for (int r = 1; r <= 10; r++) {
                        long roomId = (pgId * 1000) + (f * 100) + r;
                        if (!roomRepository.existsById(roomId)) {
                            Room room = new Room();
                            room.setId(roomId);
                            room.setPg(pg);
                            room.setFloor(floor);
                            room.setRoomType("Standard");
                            room.setSharingType(6 - f); 
                            room.setOccupiedSlots(0);
                            room.setPrice(new BigDecimal("8000"));
                            roomRepository.save(room);
                        }
                    }
                }
                pgCount++;
                if (pgCount % 10 == 0) {
                    System.out.println("DataSeeder: Progress [" + pgCount + "/110] PGs fully seeded in background...");
                }
            }
            
            System.out.println("DataSeeder: !!! BACKGROUND SEEDING COMPLETE !!! (110 PGs / 5500 Rooms created).");
        } catch (Exception e) {
            System.err.println("!!! DATA SEEDER FAILED !!!");
            e.printStackTrace();
        }
    }
}
