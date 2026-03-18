package com.staynest.repository;

import com.staynest.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByPgPgId(Long pgId);
    List<Room> findByFloor_FloorId(Long floorId);
}
