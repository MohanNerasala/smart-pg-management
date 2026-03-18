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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
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

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) {
        try {
            System.out.println("DataSeeder: Checking database state...");
            
            // 0. Bulletproof Fix: Relax room_id constraint directly via SQL
            System.out.println("DataSeeder: Relaxing room_id constraint in bookings/Bookings table...");
            try {
                // Try both cases just to be 100% bulletproof
                jdbcTemplate.execute("ALTER TABLE Bookings MODIFY room_id BIGINT NULL");
                jdbcTemplate.execute("ALTER TABLE bookings MODIFY room_id BIGINT NULL");
                System.out.println("DataSeeder: room_id constraint relaxed successfully (checked both cases).");
            } catch (Exception sqlEx) {
                System.err.println("DataSeeder: Partial success or non-critical error modifying room_id: " + sqlEx.getMessage());
            }

            // 0c. Ensure Admin User exists
            if (!userRepository.existsByEmail("admin@staynest")) {
                System.out.println("DataSeeder: Seeding Admin User...");
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@staynest");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setProvider(AuthProvider.LOCAL);
                userRepository.save(admin);
                System.out.println("DataSeeder: Admin User seeded successfully.");
            } else {
                System.out.println("DataSeeder: Admin User found. Force-resetting password to admin123...");
                User admin = userRepository.findByEmail("admin@staynest").get();
                admin.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(admin);
            }

            // Early exit if already populated to prevent 500 scrolling logs
            if (pgRepository.count() >= 10) {
                System.out.println("DataSeeder: PGs already fully seeded (count >= 10). Skipping slow loop expansion.");
                return;
            }

            /* 0b. Optional: Reset Room Occupancy (Commented out to allow multi-booking persistence)
            System.out.println("DataSeeder: [SKIPPED] Automatic System Reset...");
            try {
                // Fetch all existing rooms and reset their occupancy to 0
                // roomRepository.findAll().forEach(room -> {
                //     if (room.getOccupiedSlots() != 0) {
                //         room.setOccupiedSlots(0);
                //         roomRepository.save(room);
                //     }
                // });
            } catch (Exception resetEx) {
                System.err.println("DataSeeder: Non-critical error during system reset: " + resetEx.getMessage());
            }
            */
            
            // 1. Ensure PGs exist (Seed 1-10 for stability with AI Search)
            for (long p = 1; p <= 10; p++) {
                final long pgId = p;
                PG pg = pgRepository.findById(pgId).orElseGet(() -> {
                    System.out.println("DataSeeder: Creating PG ID " + pgId);
                    PG newPg = new PG();
                    newPg.setPgId(pgId);
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
                            .filter(fl -> fl.getFloorNumber() == floorNum && fl.getPg().getPgId().equals(pg.getPgId()))
                            .findFirst()
                            .orElseGet(() -> {
                                Floor newFloor = new Floor();
                                newFloor.setFloorNumber(floorNum);
                                newFloor.setPg(pg);
                                return floorRepository.save(newFloor);
                            });

                    // 3. Ensure 10 Rooms exist for this floor (Matches frontend r=1..10)
                    // ID logic: pgId * 1000 + floorNum * 100 + r
                    for (int r = 1; r <= 10; r++) {
                        long roomId = (pgId * 1000) + (f * 100) + r;
                        if (!roomRepository.existsById(roomId)) {
                            Room room = new Room();
                            room.setRoomId(roomId);
                            room.setPg(pg);
                            room.setFloor(floor);
                            room.setRoomType("Standard");
                            room.setSharingType(6 - f); // Matches frontend logic
                            room.setOccupiedSlots(0);
                            room.setPrice(new BigDecimal("8000"));
                            roomRepository.save(room);
                        }
                    }
                }
            }
            
            System.out.println("DataSeeder: Database state expanded to 50 Rooms/PG (PGs 1-10 Seeded).");
        } catch (Exception e) {
            System.err.println("!!! DATA SEEDER FAILED !!!");
            e.printStackTrace();
        }
    }
}
